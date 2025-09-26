
export function addArrayEndpoint(app, endpointUrl, data, baseDir = "/MCP/v1/"){
  console.log(baseDir + endpointUrl + '/:id');
  app.get(baseDir + endpointUrl + '/:id', (req, res) => {
    const id = req.params.id;
    const curChannel = data.filter((e) => e.GUID === id || e.id === id || e.Ref === id);
    if (curChannel.length > 0)
      res.json(curChannel[0]);
    else
      res.status(400).send('{}');

  });
  
  app.get(baseDir + endpointUrl, (req, res) => {
    res.json(data);
  });
}

export function addPropertyEndpoint(app, endpointUrl, data, baseDir = "/MCP/v1/"){
  app.get(baseDir + endpointUrl, (req, res) => {
    res.send(data);
  });
}