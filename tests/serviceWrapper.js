const [,, name, id] = process.argv
require(`../src/services/${name}.js`)
  .then(port => {
    process.send({
      ready: id,
      port
    })
  })
