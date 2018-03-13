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
    def do_HEAD(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_POST(self):
        path_elements = self.path.split('/')

        if path_elements[1] != 'movies':
            self.send_response(400)  # bad request
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'requested collection should be <<movies>>'}).encode())
        else:
            if len(path_elements) == 2:  # /movies
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()

                content_len = int(self.headers.get('content-length', 0))
                post_body = self.rfile.read(content_len)

                sent_movie = json.JSONDecoder(object_hook=from_json_to_dto).decode(post_body.decode())

                self.wfile.write(json.dumps(repository.add(sent_movie), cls=MovieEncoder).encode())
            else:  # /movies/1
                self.send_response(400)  # bad request
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'POST request should be called on a collection'}).encode())

    def do_GET(self):
        path_elements = self.path.split('/')

        if path_elements[1] != 'movies':
            self.send_response(400)  # bad request
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'requested collection should be <<movies>>'}).encode())
        else:
            if len(path_elements) == 2:  # /movies
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(repository.get_all(), cls=MovieEncoder).encode())
            else:  # /movies/1
                requested_movie = repository.get(int(path_elements[2]))

                if requested_movie:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(requested_movie, cls=MovieEncoder).encode())
                else:
                    self.send_response(404)  # movie was not found
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'requested movie was not found'}).encode())

    def do_PUT(self):
        path_elements = self.path.split('/')

        if path_elements[1] != 'movies':
            self.send_response(400)  # bad request
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'requested collection should be <<movies>>'}).encode())
        else:
            if len(path_elements) == 2:  # /movies
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()

                content_len = int(self.headers.get('content-length', 0))
                post_body = self.rfile.read(content_len)

                sent_movies = json.JSONDecoder(object_hook=from_json_to_dto).decode(post_body.decode())

                self.wfile.write(json.dumps(repository.replace_all(sent_movies), cls=MovieEncoder).encode())
            else:  # /movies/1
                self.send_response(400)  # bad request
                self.send_header('Content-type', 'application/json')
                self.end_headers()

                content_len = int(self.headers.get('content-length', 0))
                post_body = self.rfile.read(content_len)

                sent_movie = json.JSONDecoder(object_hook=from_json_to_dto).decode(post_body.decode())

                self.wfile.write(json.dumps(repository.replace(sent_movie), cls=MovieEncoder).encode())

    def do_DELETE(self):
        path_elements = self.path.split('/')

        if path_elements[1] != 'movies':
            self.send_response(400)  # bad request
            self.send_header('Content-type', 'application/json')
            self.end_headers()
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
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    repository.remove(int(path_elements[2]))
                    self.wfile.write(json.dumps({'message': 'movie deleted'}).encode())
                else:
                    self.send_response(404)  # movie was not found
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'requested movie was not found'}).encode())


if __name__ == '__main__':
    rest_server = HTTPServer((HOST_NAME, PORT), RestHTTPServerHandler)
    print(time.asctime(), 'Server Starts - {name}:{port}'.format(name=HOST_NAME, port=PORT))

    try:
        rest_server.serve_forever()
    except KeyboardInterrupt:
        pass

    rest_server.server_close()
    print(time.asctime(), 'Server Closes - %{name}:%{port}'.format(name=HOST_NAME, port=PORT))
