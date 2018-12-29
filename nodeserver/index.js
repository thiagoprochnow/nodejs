const express = require('express');
const app = express();
var soap = require('soap');
var url = 'https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl';

app.use(express.json());

app.get('/getcurrency/:id', (req, res) => {

    const tipo = req.params.id;

    const p = getCotacao(tipo);
    p
        .then(result => { 
            const valor = getResultValue(result);

            res.setHeader('Content-Type', 'application/json');
            if(valor != 'error') {
                console.log('Entrou2');
                res.send(JSON.stringify({
                    tipo: tipo,
                    valor: valor 
                }));
            } else {
                console.log('Entrou');
                res.send(JSON.stringify({
                    tipo: 'error'
                })); 
            }
        })
        .catch(err => console.log('Error', err.message));
  });

function getCotacao(tipo) {
	var p = new Promise(function(resolve, reject) {
        
        var codigo = "10813";

        if(tipo === 'USD'){
            codigo = "10813";
        } else if(tipo === 'EUR'){
            codigo = "21620";
        } else {
            resolve('error');
        }

        var args = {"codigoSerie ":codigo};
        
        soap.createClient(url, function(err, client){
            client.getUltimoValorVO(args, function(err, result){
                    if (err) throw err;
                    resolve(result);
            });
        });
		
		
	});

	return p;

}

function getResultValue(result){
    if(result == 'error'){
        return result;
    }
    var string = JSON.stringify(result);
    var objectValue = JSON.parse(string);
    return result['getUltimoValorVOReturn']['ultimoValor']['valor']['$value'];
}

const port = 7070;
app.listen(port, () => console.log(`Listening on port ${port}...`));