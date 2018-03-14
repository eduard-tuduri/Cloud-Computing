import json


class MovieDTOEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__


def from_json_to_dto(json_movie_dto):
    return MovieDTO(json_movie_dto['title'], json_movie_dto['year'], json_movie_dto['actors'],
                    json_movie_dto['director'])


class MovieDTO:
    def __init__(self, title, year, actors, director):
        self.title = title
        self.year = year
        self.actors = actors
        self.director = director

    def __str__(self):
        return '''Title: {title}
        Year: {year}
        Actors: {actors}
        Director: {director}
        '''.format(title=self.title, year=self.year, actors=str(self.actors), director=self.director)

    def __repr__(self):
        return '''Title: {title}
                Year: {year}
                Actors: {actors}
                Director: {director}
                '''.format(title=self.title, year=self.year, actors=str(self.actors),
                           director=self.director)

    def __len__(self):
        return 1
