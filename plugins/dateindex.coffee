# plugins/dateindex.coffee
module.exports = (env, callback) ->

  defaults =
    postsDir: 'articles' # directory containing blog posts
    template: 'post.jade'
    filenameTemplate: '/:year/:month/:day/:title/index.html' # Here's the magic part

  # assign defaults for any option not set in the config file
  options = env.config.blog or {}
  for key, value of defaults
    options[key] ?= defaults[key]

  class BlogpostPage extends env.plugins.MarkdownPage
    ### DRYer subclass of MarkdownPage ###

    getTemplate: ->
      @metadata.template or options.template or super()

    getFilenameTemplate: ->
      @metadata.filenameTemplate or options.filenameTemplate or super()

  # register the plugin
  prefix = if options.postsDir then options.postsDir + '/' else ''
  env.registerContentPlugin 'posts', prefix + '**/*.*(markdown|mkd|md)', BlogpostPage

  # done!
  callback()