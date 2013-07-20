---
  title: "noflo-github"
  description: "GitHub service components for the NoFlo flow-based programming environment"
  author: "Henri Bergius <henri.bergius@iki.fi>"
  version: "0.0.4"
  layout: "library"

---
GitHub components for NoFlo [![Build Status](https://secure.travis-ci.org/bergie/noflo-github.png?branch=master)](https://travis-ci.org/bergie/noflo-github)
=========================

This module provides components for the [NoFlo](http://noflojs.org/) flow-based programming framework to deal with the [GitHub](http://github.com/) code collaboration service.

* CreateRepository: Creates a user repository (requires OAuth token)
* CreateOrgRepository: Creates an organization repository (requires OAuth token)
* GetRepository: Fetches a repository by its name (e.g. `bergie/create`)
* GetContents: Retrieves current contents of a file in a repository
* GetCurrentUser: Retrieves information about the current user
