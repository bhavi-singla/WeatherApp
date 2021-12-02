const http = require('http');

const fs = require('fs');

const requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal)=>{
    let temprature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temprature = temprature.replace("{%tempmin%}",orgVal.main.temp_min);
    temprature = temprature.replace("{%tempmax%}",orgVal.main.temp_max);
    temprature = temprature.replace("{%location%}",orgVal.name);
    temprature = temprature.replace("{%country%}",orgVal.sys.country);
    temprature = temprature.replace("{%tempstatus%}",orgVal.weather.main);

    return temprature;
};

const server = http.createServer((req,res) => {
    
        if(req.url == "/"){

            let Place = process.argv[2];
            if(!Place)
            {
                Place='Delhi';
            }
            requests(
                `http://api.openweathermap.org/data/2.5/weather?q=${Place}&units=metric&appid=442dbe8be411b40c1e59ea18475a95bc`)
            .on("data", (chunk)=>{
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                console.log(objdata);
                
                const realTimeData = arrdata.map((val)=>replaceVal(homeFile, val)).join("");
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(realTimeData);
                res.end();
               //console.log(realTimeData);
            })
            .on("end", (err)=>{
                if(err)
                console.log("Connection closed due to errors");
                res.end();

            });
        }
});
server.listen(8000,"127.0.0.1");