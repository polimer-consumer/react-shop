import React, {useState} from 'react';

export default function SearchBar({onSearch}) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log(`Search query: ${searchQuery}`);
        onSearch(searchQuery);
        setSearchQuery('');
    };

    return (
        <>
            <form className="w-1/2" onSubmit={handleSearchSubmit}>
                <label htmlFor="content-search"
                       className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                <div className="relative">
                    <input type="search" id="content-search"
                           className="block w-full p-4 pl-10 text-sm text-gray-900 border-2 border-gray-100
                           rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                           placeholder="Search"
                           aria-label="Search"
                           value={searchQuery}
                           onChange={handleSearchChange}
                    />
                    <button type="submit"
                            className="text-white absolute right-2.5 bottom-2.5 bg-amber-900
                            hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                            font-medium rounded-lg text-sm px-4 py-2 w-1/8">
                        Search
                    </button>
                </div>
            </form>

        </>
    );
}
