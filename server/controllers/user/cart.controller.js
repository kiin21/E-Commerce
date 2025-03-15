const Product = require('../../models/Product');
const CartItems = require('../../models/CartItems');
const Cart = require('../../models/Cart');
const { QueryTypes, Op } = require('sequelize');
const sequelize = require('../../config/db');

const getCartItems = async (req, res) => {
    try {
        // Handle session-based cart
        if (!req.user) {
            if (!req.session.cart || req.session.cart.length === 0) {
                return res.status(200).json({
                    success: true,
                    cartItems: [],
                });
            }

            // Fetch product details for each item in the cart
            const productIds = req.session.cart.map((item) => item.product_id);
            const products = await Product.findAll({
                where: {
                    id: {
                        [Op.in]: productIds,
                    },
                },
                //    attributes: ['id', 'name', 'price', 'thumbnail_url', 'images', 'current_seller'],
            });

            const productMap = products.reduce((map, product) => {
                map[product.id] = product;
                return map;
            }, {});

            const sessionCartItems = req.session.cart.map((item) => {
                const product = productMap[item.product_id];
                if (!product) {
                    return null;
                }

                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    selected: item.selected,
                    product: product,
                };
            }).filter((item) => item !== null);

            return res.status(200).json({
                success: true,
                cartItems: sessionCartItems,
            });
        }
        // check req.session.cart is deleted
        console.log('req.session.cart: ', req.session.cart);

        //    console.log('req.user: ', req.user);
        // Handle database cart for authenticated users
        const cart = await Cart.findOne({
            where: {
                user_id: req.user.id,
            },
        });

        if (!cart) {
            await Cart.create({
                user_id: req.user.id,
            });
        }

        const cartItems = await CartItems.findAll({
            where: {
                cart_id: req.user.cart_id,
                is_deleted: false,
            },
            include: {
                model: Product,
                as: 'product',
                //    attributes: ['name', 'price', 'qty', 'thumbnail_url', 'current_seller'],
                required: true,
            },
            order: [
                ['created_at', 'DESC'],
            ],
        });

        return res.status(200).json({
            success: true,
            cartItems,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const addToCartItem = async (req, res) => {
    const { itemId, quantity, selected } = req.body;

    console.log('itemId: ', itemId);
    console.log('quantity: ', quantity);

    try {

        if (!req.user) {
            // Handle session-based cart for unauthenticated users
            if (!req.session.cart) {
                req.session.cart = [];
            }

            const existingItem = req.session.cart.find((item) => item.product_id === itemId);

            if (existingItem) {
                existingItem.quantity += quantity;
            }
            else {
                req.session.cart.push({
                    product_id: itemId,
                    quantity,
                    selected
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Item added to cart',
                cartItem: req.session.cart,
            });
        }

        // Handle database cart for authenticated users
        const cartItem = await CartItems.findOne({
            where: {
                cart_id: req.user.cart_id,
                product_id: itemId,
                is_deleted: false,
            },
        });

        // Find the length of the cart
        let length = 0;
        const cartItems = await CartItems.findAll({
            where: {
                cart_id: req.user.cart_id,
                is_deleted: false,
            },
        });

        if (cartItems) {
            length = cartItems.length;
        }

        // If item not found in cart, add it
        if (!cartItem) {
            const newCartItem = await CartItems.create({
                cart_id: req.user.cart_id,
                product_id: itemId,
                quantity,
            });

            return res.status(200).json({
                success: true,
                cartItem: newCartItem,
                length: length + 1,
            });
        }

        cartItem.quantity += quantity;
        await cartItem.save();

        return res.status(200).json({
            success: true,
            cartItem,
            length,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const mergeSessionCartToDatabase = async (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0 || !req.user) {
        return res.status(200).json({
            success: true,
            message: 'No session cart to merge',
        });
    }

    try {

        const sessionCart = req.session.cart;

        for (const item of sessionCart) {
            const { itemId, quantity, selected } = item;

            const cartItem = await CartItems.findOne({
                where: {
                    cart_id: req.user.cart_id,
                    product_id: itemId,
                    is_deleted: false,
                },
            });

            if (!cartItem) {
                await CartItems.create({
                    cart_id: req.user.cart_id,
                    product_id: itemId,
                    quantity,
                    selected,
                });
            }
            else {
                cartItem.quantity += quantity;
                await cartItem.save();
            }
        }


        // Clear session cart after merging
        req.session.cart = [];
        console.log('req.session.cart: ', req.session.cart);

        return res.status(200).json({
            success: true,
            message: 'Session cart merged to database',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity, selected } = req.body;
    console.log('itemId: ', itemId);
    const parsedItemId = parseInt(itemId, 10);
    try {
        // Handle session-based cart
        if (!req.user) {
            if (!req.session.cart) {
                return res.status(404).json({
                    success: false,
                    message: 'No cart found in session',
                });
            }

            const cartItem = req.session.cart.find((item) => item.product_id === parseInt(itemId, 10));

            if (!cartItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found in cart',
                });
            }

            cartItem.quantity = quantity;
            cartItem.selected = selected;

            return res.status(200).json({
                success: true,
                cartItem,
            });
        }

        // Handle database cart for authenticated users
        const cartItem = await CartItems.findOne({
            where: {
                cart_id: req.user.cart_id,
                product_id: parsedItemId,
                is_deleted: false,
            },
        });

        // If item not found in cart, add it
        if (!cartItem) {
            const newCartItem = await CartItems.create({
                cart_id: req.user.cart_id,
                product_id: parsedItemId,
                quantity,
                selected: true,
            });

            return res.status(200).json({
                success: true,
                cartItem: newCartItem,
            });
        }

        cartItem.quantity = quantity;
        cartItem.selected = selected;
        await cartItem.save();

        return res.status(200).json({
            success: true,
            cartItem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteCartItem = async (req, res) => {
    const { itemIds } = req.body;

    const parsedItemIds = itemIds.map((id) => parseInt(id, 10));

    try {
        // Handle session-based cart
        if (!req.user) {
            if (!req.session.cart) {
                return res.status(404).json({
                    success: false,
                    message: 'No cart found in session',
                });
            }

            req.session.cart = req.session.cart.filter((item) => !parsedItemIds.includes(item.product_id));

            return res.status(200).json({
                success: true,
                message: 'Items removed from cart',
            });
        }

        // Handle database cart for authenticated users
        await CartItems.update({
            is_deleted: true,
        }, {
            where: {
                cart_id: req.user.cart_id,
                product_id: {
                    [Op.in]: parsedItemIds,
                },
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Items removed from cart',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCartSummary = async (req, res) => {
    try {
        // Handle session-based cart
        if (!req.user) {
            if (!req.session.cart || req.session.cart.length === 0) {
                return res.status(200).json({
                    success: true,
                    cartSummary: {
                        total_items: 0,
                        total_price: 0,
                    },
                });
            }

            const cartSummary = req.session.cart.reduce(
                (summary, item) => {
                    if (item.selected) {
                        summary.total_items += item.quantity;
                        summary.total_price += item.quantity * item.price;
                    }
                    return summary;
                },
                {
                    total_items: 0,
                    total_price: 0,
                }
            );

            return res.status(200).json({
                success: true,
                cartSummary,
            });
        }

        // Handle database cart for authenticated users
        const cartSummary = await sequelize.query(`
            SELECT 
                SUM(ci.quantity) as total_items,
                SUM(ci.quantity * p.price) as total_price
            FROM cart_items ci
            JOIN product p ON ci.product_id = p.id
            WHERE ci.cart_id = ${req.user.cart_id}
            AND ci.is_deleted = false 
            AND ci.selected = true
        `, {
            type: QueryTypes.SELECT,
        });

        return res.status(200).json({
            success: true,
            cartSummary: cartSummary[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addToCartItem,
    getCartItems,
    updateCartItem,
    deleteCartItem,
    getCartSummary,
    mergeSessionCartToDatabase,
};