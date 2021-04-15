require('../service')(async (app, express) => {
  app.use(express.static(process.env.WWW_ROOT))

  return {
    name: 'www'
  }
})
