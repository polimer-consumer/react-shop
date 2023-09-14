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
        <div>
            <form className="form-inline" onSubmit={handleSearchSubmit}>
                <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className="btn btn-success" type="submit">
                    Search
                </button>
            </form>
        </div>
    );
}
