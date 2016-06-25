NoFlo website
=============

Sources for the [NoFlo](http://noflojs.org) website.

## Updating for new versions

* Edit the version number in `_config.yml`
* Update API documentation via `grunt build` (or `cd _src && git pull && cd .. && grunt docco`)
* Ensure usage documentation is up-to-date

## Contributing to the site

Feel free to send pull requests. Local site development is handled using [Grunt](http://gruntjs.com/).

Install the dependencies with:

    $ npm install

You also need some additional tools:

    $ sudo gem install jekyll
    $ sudo gem install sass --pre
    $ sudo gem install jekyll-redirect-from
    $ sudo gem install recarpet

Then to develop the site, run:

    $ grunt dev

This will start a web server at <http://localhost:4000>. Grunt watches for any changes in the source files and triggers a rebuild as needed.
