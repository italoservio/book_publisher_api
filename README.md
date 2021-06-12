<h1 align="center">Book Publisher API 📚</h1>
<p align="center">
This is an academic work aimed at developing a RESTful API for a book publisher. The project was developed in NodeJS with ExpressJS in Javascript, Sequelize ORM was used in a SQLite database with data validation done with Yup.
</p>

<br />

<h3 align="center"> 
	🟢 Status: Concluded
</h3>

<br />

<h3 align="center">😍 How to use</h3>
<p align="center">The first step after downloading the project is to update the NPM packages. To do this you need to have NodeJS and NPM installed (<a href="https://nodejs.org/en/">Go to NodeJS download page</a>). To do this, open the terminal in the project folder and type:</p>
<pre>
  npm update
</pre>
<p align="center">If you want to recreate the database, delete the file "db.sqlite", and in the file "database/database.js" uncomment line 9 on the first run:</p>
<pre>
  (async () => { await sequelize.sync(); })();
</pre>
<p align="center">To run the project, open the terminal in the project folder and execute the command:</p>
<pre>
  npm run dev
</pre>
<p align="center">The server will go up at port 5000 by default. To access the routes, just type in your browser: <a href="http://localhost:5000">http://localhost:5000</a> and the respective route.</p>

<br />

<h3 align="center">🧠 Understanding</h3>
<p align="center">
<b><i>A POSTMAN COLLECTION IS INCLUDED IN THE PROJECT</i></b>. So, you can import this collection and have fun. <br />
In all routes of type "Patch" all parameters are optional, except the "id". <br/>
</p

<br />
	
<h3 align="center">👁 Routes overview</h3>
<pre>
  // Book routes
  router.get('/', bookController.all);
  router.post('/', bookController.new);
  router.get('/:id', bookController.one);
  router.delete('/:id', bookController.remove);
  router.patch('/', bookController.change);
</pre>

<br />
<h3 align="center">🏛 ERD</h3>
<p align="center">The complete database structure:</p>
<h1 align="center">
  <img alt="ERD" src="https://i.imgur.com/V7vrvNo.png" />
</h1>

<br />
<br />

<h3 align="center">🎨 Contributor(s)</h4>
<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/ItaloServio">
        <img src="https://avatars1.githubusercontent.com/u/60075865?s=460&u=407042a6a58218d29495ca19dda1bef5ca4540c3&v=4" width="100px;" alt="Profile"/>
        <br />
        <sub>
          <b>Ítalo Sérvio</b>
        </sub>
      </a>
  </tr>  
</table>
