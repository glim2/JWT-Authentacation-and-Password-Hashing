const { syncAndSeed } =  require('./db');
const app = require('./app');

const init = async()=> {
  await syncAndSeed();
  const port = process.env.PORT || 3000;
  process.env.MY_VARIABLE = 'ahoy';
  app.listen(port, ()=> console.log(`listening on port ${port} and ${process.env.MY_VARIABLE}`));
  
};

init();