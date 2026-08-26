import { memo } from 'react'

const Search = memo(({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
        <div>
            <img src="/search.svg" alt="search" />

            <input 
                type="text"
                placeholder="Search through thousands of Movies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
})

export default Search
