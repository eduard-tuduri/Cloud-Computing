from cloudmovies import get_model, oauth2, storage
from flask import Blueprint, current_app, redirect, render_template, request, \
    session, url_for

_filter = Blueprint('filter', __name__)


@_filter.route('/asc')
def asc_filtered_list():
    token = request.args.get('page_token', None)
    if token:
        token = token.encode('utf-8')

    movies, next_page_token = get_model().list(cursor=token)

    movies = sorted(movies, key=lambda x: x['releaseDate'])

    return render_template(
        "list.html",
        movies=movies,
        next_page_token=next_page_token)


@_filter.route('/desc')
def desc_filtered_list():
    token = request.args.get('page_token', None)
    if token:
        token = token.encode('utf-8')

    movies, next_page_token = get_model().list(cursor=token)

    movies = sorted(movies, key=lambda x: x['releaseDate'], reverse=True)

    return render_template(
        "list.html",
        movies=movies,
        next_page_token=next_page_token)
