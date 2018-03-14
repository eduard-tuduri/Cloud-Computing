import movie
import json


class MovieRepository:
    def __init__(self):
        with open('movies.json', 'r') as f:
            self.movies = json.JSONDecoder(object_hook=movie.from_json).decode(f.read())

    def get_all(self):
        return self.movies

    def get(self, movie_id):
        return list(filter(lambda x: x.id == movie_id, self.movies))

    def add(self, movie_object):
        if isinstance(movie_object, list):
            last_id = max(self.movies).id + 1
            for _movie in movie_object:
                _movie.id = last_id
                self.movies.append(movie.Movie(_movie.id, _movie.title, _movie.year, _movie.actors, _movie.director))
                last_id += 1
        else:
            movie_object.id = max(self.movies).id + 1
            self.movies.append(movie.Movie(movie_object.id, movie_object.title, movie_object.year, movie_object.actors,
                                           movie_object.director))

        with open('movies.json', 'w') as f:
            json.dump(self.movies, f, cls=movie.MovieEncoder)

        return movie_object

    def remove(self, movie_id):
        self.movies = list(filter(lambda x: x.id != movie_id, self.movies))

        with open('movies.json', 'w') as f:
            json.dump(self.movies, f, cls=movie.MovieEncoder)

    def remove_all(self):
        self.movies = []

        with open('movies.json', 'w') as f:
            json.dump(self.movies, f, cls=movie.MovieEncoder)

    def replace(self, movie_id, movie_object):
        found_movie = next((_movie for _movie in self.movies if _movie.id == movie_id), None)

        if found_movie:
            movie_object.id = movie_id
            self.movies.remove(found_movie)
            self.movies.append(movie_object)

            with open('movies.json', 'w') as f:
                json.dump(self.movies, f, cls=movie.MovieEncoder)
        else:
            self.add(movie_object)

    def replace_all(self, new_movies):
        self.movies = new_movies

        for i in range(1, len(self.movies) + 1):
            self.movies[i - 1].id = i

        with open('movies.json', 'w') as f:
            json.dump(self.movies, f, cls=movie.MovieEncoder)

        return self.movies


if __name__ == '__main__':
    repo = MovieRepository()
    print(repo.get(2))
