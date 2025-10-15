

export function addArrayEndpoint(app, endpointUrl, data, baseDir = "/MCP/v1/") {
  console.log(baseDir + endpointUrl + '/:id');
  app.get(baseDir + endpointUrl + '/:id', (req, res, next) => {
    const id = req.params.id;
    const curChannel = data.filter((e) => e.GUID === id || e.id === id || e.Ref === id);
    if (curChannel.length > 0)
      res.locals.result = (curChannel[0]);
    res.send(res.locals.result);
  });

  app.get(baseDir + endpointUrl, (req, res, next) => {
    res.locals.result = (data);
    res.send(res.locals.result);
  });
}

export function addPropertyEndpoint(app, endpointUrl, data, baseDir = "/MCP/v1/") {
  app.get(baseDir + endpointUrl, (req, res, next) => {
    res.locals.result =(data);
    res.send(res.locals.result);
  });
}