----------
# 2016-06-20

## /changelog
- created

## /index
- updated 404 links from /library to github

## /components
- moving async component information from /components to /legacy
- adding CommonJS link
- move subgraphs to /graphs

## /legacy
- comparison of WirePattern vs Process

## /process-api
- changed IA order so component states are higher up
- changing xml-esque firing pattern example to sequentially ordered IPs
- splitting processing `getting` and `sending`
- fixed stram typo

## /graphs
- created /graphs
- moved /fbp & /json to folders as indexes so they will not appear in the sidebar, now they are merged into /graphs
- add a more simple example of using subgraphs

## package.json
- added license field & repo link

## readme.md
- updating required gems

## Gruntfile.coffee
- removed imgmin
- comment out 'docco' from task: 'build' because of error `Fatal error: spawn pygmentize ENOENT`

## /publishing
- changing example link from [noflo-basecamp](https://github.com/noflo/noflo-basecamp) to [noflo-core](https://github.com/noflo/noflo-core) and [ingres-table](https://github.com/c-base/ingress-table)
- change `component.json` link from depreciated in 2014, to latest

## /glossary
- adding CommonJS link

# canadianness

## spec/
- first round at fbp-spec, long error.

----------
# 2016-06-21

## /components & /process-api
- moved port attributes from /process-api to /components/#port-attributes
- adding IP info
- reordering index

## *
- changing 'did you know' blocks from <blockquote> to jekyll styled <div>s

## /debugging
- created

## /testing
- removed for now, should it just reference writing-projects guide?

## process-api
- fix component-states header link
- use destructuring when getData with multiple
- changing xml of per packet to be flow order same as full stream

----------
# 2016-06-22

## /process-api
- changing null brackets to use default
- fix scope header
- expand scope content

## /writing-projects
- linking to noflo-core & InternalSockets

## /process-api -> /testing
- moving bracket forwarding example so it will be replaced with an animation into testing to be used as component loading example

## /components#portevents
- added IP

## config
- added redcarpet extension

## css
- added table styles

## legacy
- table md
- translation extension

## graphs
- fixing json anchor
- change blockquote to notes div
- make order of code (js, cs) consistent

## writing projects
- make writing your own projects in its own folder
- make initial layout for it

----------
# 2016-06-23

## writing projects
- adding page weights and sorting in order
- adding links to the repo for each part and links to next part of the guide
## FindEhs
- expanding on FindEhs
## graphs
- linking to subgraphs docs

## process-api
- adding note about `control` ports dealing with only data

## graphs
- changing subraph punctuation
- adding flowhub section

## package.json
- creating

## projects/embedding
- creating
- rewrite index of canadianness and document it
- add ss example of flowtrace and instructions on using it

## projects/summary
- splitting from index of /projects

## hidden
- added async-components, fbp, json, and protocol back as files, then hid them from the documentation navigation

----------
# 2016-06-24

## graphs
- screenshots

## testing
- codeblock highlighting

## publishing
- add publishing NPM with Travis guide
- remove old parts
- add index



