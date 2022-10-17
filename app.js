const express=require("express");
const mysql=require("mysql2");
const bodyParser=require("body-parser");
var app=express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
const con=mysql.createConnection({
    host:process.env.HOST||"localhost",
    user:process.env.USER||"root",
    port:process.env.DBPORT||"3306",
    password:process.env.PSW||"l@wl1et",
    database:process.env.DB||"crudnode"
});
try{
    con.connect();
    console.log("se conecto a la bd");
}catch(err){
    console.log("Error al contectar a la bd");
}

app.get("/",(req,res)=>{
    res.write(`
    <!doctype html>
    <html lang="en">
    <head> 
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script> 
        <title>CRUD</title>
    </head>
        <body>
        
            <script>
                const redirigir=(i,mode)=>{
                    const id=document.getElementById("id"+i).childNodes[0].textContent;
                    const placement=window.location.href;
                    mode==0?window.location.href=id+"/modify":window.location.href=id+"/delete";
                }
            </script>
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
                <div class="container-fluid">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" href="/">Consultas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="create.html">Agregar Nuevo Juego</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="container mt-3">
                <div class="mt-4 p-5 bg-primary text-white rounded  bg-warning text-dark" >
                    <h1>CRUD VIDEOJUEGOS</h1> 
                    <p>Diego Alonso García Corona 5IV9 </p> 

                </div>
                

            <br>
            <table class="table table-hover">
                <thead class="table-primary">
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Creador</th>
                        <th>Calificacion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>`);
    let j=1;
    con.query(`SELECT * FROM libros`,(err,result)=>{
        result.map((element)=>{
            res.write(`
                <tr>
                    <td id="id${j}">${element.id}</td>
                    <td>${element.nombre}</td>
                    <td>${element.autor}</td>
                    <td>${element.calificacion}</td>
                    <td>
                        <button id="${j}" onclick="redirigir(id,0)" type="button" class="btn btn-outline-success">Modificar</button>
                        <button name="${j}" onclick="redirigir(name,1)" type="button" class="btn btn-outline-danger">Eliminar</button>
                    </td>
                </tr>
            `);
            j++;
        });
        res.write(`
            </tbody>
            </table>
            <div class="d-grid">
                <a href="create.html" type="button" class="btn btn-primary  bg-success text-white"">Agregar</a>
            </div>
        `);
        res.end();
    });
    res.write(`
                </div>
            </body>
        </html>
    `);
});
/** 
 * RESPONDER A /SAVE
 */
app.get("/:id/delete",(req,res)=>{
    con.query(`DELETE FROM libros WHERE id=${req.params['id']}`,(err,result)=>{
        if(!err){res.redirect("/")}
    });
});
app.get("/:id/modify",(req,res)=>{
    globalThis.id=req.params['id'];
    con.query(`SELECT * FROM libros WHERE id=${id}`,(err,result)=>{
        if(result.length==0){
            res.sendStatus(404);
        }else{
            res.write(`
            <!doctype html>
            <html lang="en">
              <head> 
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> 
                <title>CRUD</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script> 
              </head>
              <body>
                <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
                  <div class="container-fluid">
                      <ul class="navbar-nav">
                          <li class="nav-item">
                                <a class="nav-link" href="/">Consultas</a>
                          </li>
                          <li class="nav-item">
                                <a class="nav-link"  href="../create.html">Agregar Nuevo Libro</a>
                          </li>
                      </ul>
                  </div>
              </nav>
                <div class="container mt-4">     
                    <div class="card border-secondary">  
                        <div class="card-header">Editar Registro</div>
                        <div class="card-body">
                            <form action="/modify" method="POST">
                                <div class="mb-3">
                                    <label for="user" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="nombre" name="nombre" value="${result[0].nombre}" tabindex="2">
                                </div>             
                                <div class="mb-3">
                                    <label for="user" class="form-label">Creador</label>
                                    <input type="text" class="form-control" id="autor" name="autor" value="${result[0].autor}" tabindex="3">
                                </div>             
                                <div class="mb-3">
                                    <label for="user" class="form-label">Calificación</label>
                                    <input type="text" class="form-control" id="calificacion" name="calificacion" value="${result[0].calificacion}" tabindex="4">
                                </div> 
                                <button type="submit" class="btn btn-primary" tabindex="5">Guardar</button>
                                <a href="/" class="btn btn-secondary">Cancelar</a>
                            </form>
                        </div>
                    </div>
                </div>
                </body>
            </html>
            `);
            res.end();
        }
    });
});
app.post("/modify",(req,res)=>{
    const newNombre=req.body.nombre;
    const newAutor=req.body.autor;
    const newCalificacion=req.body.calificacion;
    con.query(`UPDATE libros SET nombre=?,autor=?,calificacion=? WHERE id=${id}`,[newNombre,newAutor,newCalificacion],(err,result)=>{
        if(!err){res.redirect("/");}
    });
});
app.post("/save",(req,res)=>{
    const nombre = req.body.nombre;
    const autor = req.body.autor;
    const calificacion = req.body.calificacion;
    con.query(`insert into libros(nombre,autor,calificacion) values(?,?,?)`,[nombre,autor,calificacion],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
});
const port=process.env.PORT||8000;
app.listen(port,()=>{
    console.log(`SERVER ON PORT ${port}`);
});