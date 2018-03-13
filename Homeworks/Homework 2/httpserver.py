import time
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from movie_repository import MovieRepository
from movie import MovieEncoder
from movie_dto import from_json_to_dto

HOST_NAME = 'localhost'
PORT = 9000

repository = MovieRepository()


class RestHTTPServerHandler(BaseHTTPRequestHandler):
    def set_header(self, status_code, content_type):
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        self.end_headers()

    def do_HEAD(self):
        self.set_header(200, 'application/json')

    def do_POST(self):
        try:
            path_elements = self.path.split('/')

            if path_elements[1] != 'movies':
                self.set_header(400, 'application/json')
                self.wfile.write(json.dumps({'error': 'requested collection should be <<movies>>'}).encode())
            else:
                if len(path_elements) == 2:  # /movies
                    self.set_header(200, 'application/json')

                    content_len = int(self.headers.get('content-length', 0))
                    post_body = self.rfile.read(content_len)

                    sent_movie = json.JSONDecoder(object_hook=from_json_to_dto).decode(post_body.decode())

                    self.wfile.write(json.dumps(repository.add(sent_movie), cls=MovieEncoder).encode())
                else:  # /movies/1
                    self.set_header(400, 'application/json')
                    self.wfile.write(json.dumps({'error': 'POST request should be called on a collection'}).encode())

        except AttributeError:
            self.send_header(500, 'application/json')
            self.wfile.write(json.dumps({'error': 'Internal Server Error! Bad Attribute'}).encode())

        except ValueError:
            self.send_header(500, 'application/json')
            self.wfile.write(json.dumps({'error': 'Internal Server Error! Bad Attribute'}).encode())

    def do_GET(self):
        try:
            path_elements = self.path.split('/')

            if path_elements[1] != 'movies':
                self.set_header(400, 'application/json')
                self.wfile.write(json.dumps({'error': 'requested collection should be <<movies>>'}).encode())
            else:
                if len(path_elements) == 2:  # /movies
                    self.set_header(200, 'application/json')
                    self.wfile.write(json.dumps(repository.get_all(), cls=MovieEncoder).encode())
                else:  # /movies/1
                    requested_movie = repository.get(int(path_elements[2]))

                    if requested_movie:
                        self.set_header(200, 'application/json')
                        self.wfile.write(json.dumps(requested_movie, cls=MovieEncoder).encode())
                    else:
                        self.set_header(404, 'application/json')
                        self.wfile.write(json.dumps({'error': 'requested movie was not found'}).encode())

        except AttributeError:
            self.send_header(500, 'application/json')
            self.wfile.write(json.dumps({'error': 'Internal Server Error! Bad Attribute'}).encode())

        except ValueError:
            self.send_header(500, 'application/json')
            self.wfile.write(json.dumps({'error': 'Internal Server Error! Bad Attribute'}).encode())

    def do_PUT(self):
        try:

            path_elements = self.path.split('/')

            if path_elements[1] != 'movies':
                self.set_header(400, 'application/json')
                self.wfile.write(json.dumps({'error': 'requested collection should be <<movies>>'}).encode())
            else:
                if len(path_elements) == 2:  # /movies
                    self.set_header(200, 'application/json')

                    content_len = int(self.headers.get('content-length', 0))
                    post_body = self.rfile.read(content_len)

                    sent_movies = json.JSONDecoder(object_hook=from_json_to_dto).decode(post_body.decode())

                    self.wfile.write(json.dumps(repository.replace_all(sent_movies), cls=MovieEncoder).encode())
                else:  # /movies/1
                    self.set_header(400, 'application/json')

                    content_len = int(self.headers.get('content-length', 0))
                    post_body = self.rfile.read(content_len)

                    sent_movie = json.JSONDecoder(object_hook=from_json_to_dto).decode(post_body.decode())

                    self.wfile.write(
                        json.dumps(repository.replace(int(path_elements[2]), sent_movie), cls=MovieEncoder).encode())

        except AttributeError:
            self.send_header(500, 'application/json')
            self.wfile.write(json.dumps({'error': 'Internal Server Error! Bad Attribute'}).encode())

        except ValueError:
            self.send_header(500, 'application/json')
            self.wfile.write(json.dumps({'error': 'Internal Server Error! Bad Attribute'}).encode())

    def do_DELETE(self):
        try:

            path_elements = self.path.split('/')

            if path_elements[1] != 'movies':
                self.set_header(400, 'application/json')
                self.wfile.write(json.dumps({'error': 'requested collection should be <<movies>>'}).encode())
            else:
                if len(path_elements) == 2:  # /movies
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    repository.remove_all()
                    self.wfile.write(json.dumps({'message': 'all movies deleted'}).encode())
                else:  # /movies/1
                    requested_movie = repository.get(int(path_elements[2]))

                    if requested_movie:
                        self.set_header(200, 'application/json')
                        repository.remove(int(path_elements[2]))
                        self.wfile.write(json.dumps({'message': 'movie deleted'}).encode())
                    else:
                        self.set_header(404, 'application/json')
                        self.wfile.write(json.dumps({'error': 'requested movie was not found'}).encode())

        except AttributeError:
            self.send_header(500, 'application/json')
            self.wfile.write(json.dumps({'error': 'Internal Server Error! Bad Attribute'}).encode())

        except ValueError:
            self.send_header(500, 'application/json')
            self.wfile.write(json.dumps({'error': 'Internal Server Error! Bad Attribute'}).encode())


if __name__ == '__main__':
    rest_server = HTTPServer((HOST_NAME, PORT), RestHTTPServerHandler)
    print(time.asctime(), 'Server Starts - {name}:{port}'.format(name=HOST_NAME, port=PORT))

    try:
        rest_server.serve_forever()
    except KeyboardInterrupt:
        pass

    rest_server.server_close()
    print(time.asctime(), 'Server Closes - %{name}:%{port}'.format(name=HOST_NAME, port=PORT))
