import { memo } from 'react'

const PopupCard = memo(({ movie, onClose }) => {
  return (
    <div
      className="movie-modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-modal-title"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="movie-modal-close"
        type="button"
        onClick={onClose}
        aria-label="Close movie details"
      >
        &times;
      </button>
      <img
        src={movie.poster_path
          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          : '/no-movie.png'}
        alt={movie.title}
      />
      <div>
        <h2 id="movie-modal-title">{movie.title}</h2>
        <p>{movie.overview || 'No overview available.'}</p>
        <p>
          Rating: {movie.vote_average
            ? movie.vote_average.toFixed(1)
            : 'N/A'}
        </p>
        <p>Release date: {movie.release_date || 'N/A'}</p>
      </div>
    </div>
  )
})

export default PopupCard