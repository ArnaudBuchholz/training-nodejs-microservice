require('../service')(async app => {

  app.use(express.static(process.env.WWW_ROOT))

  return {
    name: 'www'
  }
})
