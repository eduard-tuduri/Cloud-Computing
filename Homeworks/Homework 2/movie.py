import json


class MovieEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__


def from_json(json_movie):
    return Movie(json_movie['id'], json_movie['title'], json_movie['year'], json_movie['actors'],
                 json_movie['director'])


class Movie:
    def __init__(self, movie_id, title, year, actors, director):
        self.id = movie_id
        self.title = title
        self.year = year
        self.actors = actors
        self.director = director

    def __str__(self):
        return '''ID: {id}
        Title: {title}
        Year: {year}
        Actors: {actors}
        Director: {director}
        '''.format(id=self.id, title=self.title, year=self.year, actors=str(self.actors), director=self.director)

    def __repr__(self):
        return '''ID: {id}
                Title: {title}
                Year: {year}
                Actors: {actors}
                Director: {director}
                '''.format(id=self.id, title=self.title, year=self.year, actors=str(self.actors),
                           director=self.director)

    def __eq__(self, other):
        return self.title == other.title and self.director == other.director and self.actors == other.actors \
               and self.year == other.year

    def __gt__(self, other):
        return self.id > other.id

    def __len__(self):
        return 1


if __name__ == '__main__':
    movie1 = Movie(1, 'Star Wars', 1977, ['Mark Hammil', 'Harrison Ford', 'Carrie Fisher'], 'George Lucas')
    movie2 = Movie(2, 'Star Trek', 1976, ['Wiliam Shatner', 'Leonard Nimoy'], 'Robert Wise')
    movie3 = Movie(3, 'The Godfather', 1972, ['Marlon Brando', 'Al Pacino'], 'Francis-Ford Coppola')
    movie4 = Movie(4, 'Pulp Fiction', 1994, ['Samuel L. Jackson', 'John Travolta', 'Bruce Willis', 'Uma Thurman'],
                   'Quentin Tarantino')
    movie5 = Movie(5, 'Mary Poppins', 1964, ['Julie Andrews', 'Dick Van Dyke'], 'Robert Stevenson')

    movies = [movie1, movie2, movie3, movie4, movie5]

    with open('movies.json', 'w') as f:
        json.dump(movies, f, cls=MovieEncoder)

    print('Finished adding movies')
