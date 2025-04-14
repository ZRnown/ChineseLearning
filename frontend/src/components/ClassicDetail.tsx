// ... 现有代码保持不变 ...

return (
    <div className="w-[95%] max-w-[1280px] mx-auto py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
            <Link to="/classics" className="flex items-center text-blue-600 hover:text-blue-800">
                <BiArrowBack className="mr-2" /> 返回古籍列表
            </Link>
        </div>
        
        {/* 古籍详情 */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            {/* ... 古籍详情内容保持不变 ... */}
        </div>
        
        {/* 内容区域 */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            {/* ... 内容区域保持不变 ... */}
        </div>
    </div>
);

// ... 现有代码保持不变 ...