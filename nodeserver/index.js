const express = require('express');
const app = express();
var soap = require('soap');
var url = 'https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl';

app.use(express.json());

app.get('/', (req, res) => {
    const p = getCotacao();
    p
        .then(result => console.dir(result))
        .catch(err => console.log('Error', err.message));
  });

function getCotacao() {
	var p = new Promise(function(resolve, reject) {
        
        var args = {"codigoSerie ":"10813"};
        
        soap.createClient(url, function(err, client){
            client.getUltimoValorXML(args, function(err, result){
                    if (err) throw err;
                    resolve(result);
            });
        });
		
		
	});

	return p;

}

const port = 7070;
app.listen(port, () => console.log(`Listening on port ${port}...`));