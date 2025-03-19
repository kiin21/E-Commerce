function CategoryItem(props) {
    const { thumbnail, name, navigateTo } = props;
    
    return (
        <div
            className="flex flex-col items-center p-4 hover:shadow-md transition-all duration-300 rounded-xl cursor-pointer group bg-white hover:bg-gray-50"
            onClick={navigateTo}
        >
            {/* Improved image container with subtle hover effect */}
            <div className="w-20 h-20 mb-3 overflow-hidden group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-20 rounded-full transition-opacity"></div>
                <img
                    src={thumbnail}
                    alt={name}
                    className="w-full h-full object-contain p-1"
                />
            </div>

            {/* Improved text styling */}
            <p className="text-sm sm:text-base text-gray-700 text-center leading-tight max-w-[120px] font-medium group-hover:text-blue-600 transition-colors duration-300">
                {name}
            </p>
        </div>
    );
}

export default CategoryItem;