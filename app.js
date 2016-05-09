var crypto = require('crypto'),
	util = require('util'),
	request = require('request');

var secret = '',
	token = '';

function generateAuthToken(method, path, timestamp) {
	var stringToSign = method + ' ' + path + ' ' + timestamp;

	var hmac = crypto.createHmac('SHA1', secret);
	hmac.update(stringToSign);

	return token + ':' + hmac.digest('hex');
}


function createOrderTest() {
	var timestamp = Date.now();

	var order = {
		destination: {
			name: 'destination'
		},
		orderData: {
			sourceOrderId: '',
			email: 'customer@clientco.com',
			items: [
				{
					sourceItemId: 'itemId',
					sku: 'sku',
					quantity: 10,
					components: [
						{
							code: 'componentCode',
							fetch: true,
							path: 'fileUrl'
						}
					]
				}
			],
			shipments: [
				{
					shipTo: {
						name: 'Peter Pan',
						companyName: 'Disney Corporation',
						address1: '1313 Disneyland Drive',
						town: 'Anaheim',
						state: 'CA',
						postcode: '92802',
						isoCountry: 'US'
					},
					carrier: {
						code: 'shipCode',
						service: 'shipService'
					}
				}
			]
		}
	};

	request.post('https://connect.oneflowcloud.com/api/order', {
		json: true,
		body: order,
		headers: {
			'x-oneflow-authorization': generateAuthToken('POST', '/api/order', timestamp),
			'x-oneflow-date': timestamp
		}
	}, function(err, res, body) {
		console.log(util.inspect(body, false, null));
	});
}


createOrderTest();