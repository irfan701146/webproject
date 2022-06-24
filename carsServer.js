let express =require("express");
let app = express();
app.use(express.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, OPTIONS, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
var port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

let {cars,carMaster} =require("./carsData.js");


app.get("/cars",function(req,res){
    let minPrice= +req.query.minPrice;
    let maxPrice= +req.query.maxPrice;
    let sortBy=req.query.sortBy;
    let fuel=req.query.fuel;
    let type=req.query.type;
    let models=fuel?carMaster.filter((car)=>car.fuel===fuel).map(car=>car.model):carMaster.map(car=>car.model);
     models=type?models.filter((m1)=>carMaster.find(car=>car.type==type && m1==car.model)):models;
    console.log(models);
    let arr1=minPrice?cars.filter((car)=>car.price>=minPrice):cars;
    arr1=maxPrice?arr1.filter((car)=>car.price<=maxPrice):arr1;
    arr1=fuel||type?arr1.filter((car)=>models.find((m1)=>m1===car.model)):arr1;
    arr1=sortBy=="kms"?arr1.sort((c1,c2)=>c1.kms-c2.kms):arr1;
    arr1=sortBy=="price"?arr1.sort((c1,c2)=>c1.price-c2.price):arr1;
    arr1=sortBy=="year"?arr1.sort((c1,c2)=>c1.year-c2.year):arr1;
    res.send(arr1);
})
app.get("/cars/:id",function(req,res){
    let id=req.params.id;
    let car=cars.find((c1)=>c1.id==id);
    res.send(car);
})

app.post("/cars",function(req,res){
    let body=req.body;
    cars.push(body);
    res.send(body);
})

app.put("/cars/:id",function(req,res){
    let body =req.body;
    let id=req.params.id;
    let index =cars.findIndex(cus=>cus.id===id);
    if(index>=0)
    {
        let updatedCar={id:id,...body};
        cars[index]=updatedCar
        res.send(updatedCar);
    }
    else
    {
        res.status(404).send("Car Not Found")
    }
})

app.delete("/cars/:id",function(req,res){
    let id=req.params.id;
    let index =cars.findIndex(cus=>cus.id===id);
    if(index>=0)
    {  
        let deletedCar=cars.splice(index,1)
        res.send(deletedCar);
    }
    else
    {
        res.status(404).send("Car Not Found")
    }
})
