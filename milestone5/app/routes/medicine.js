const request = require('request');


exports.viewAllMed = (req, res) =>
{
  const profile_id = req.params.profile_id;

  const host = 'http://localhost:3000';
  const path = '/api/medicine/'+profile_id;
  request.get(
  {
    headers: {
      'content-type' : 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+req.body.token
    },
    url: host+path,
    'json' : true
  },
  (error, response, body) =>
  {
    if (response.statusCode >= 400)
    {
      renderError('error', response, body, res);
    }
    else
    {
      console.log(body);
      res.render('viewAllMed', 
      {
        isHomePage: true,
        pageTitle: "All Medication",
        medicineList: body,
      });
    }
  });


}


exports.viewPillDetail = (req, res) =>
{
  res.render('viewPillDetail',
  {
    backbuttonShow: true,
    pageTitle: "Medication Detail"
  });
};


exports.addNewMed = (req, res) =>
{
  res.render('addNewMed',
  {
    backbuttonShow: true,
    pageTitle: "Add New Medicine",
    profile_id: req.params.profile_id,
    shapeList: ['split', 'hole', 'circle', 'oval'],
    colorList: ['red', 'orange', 'yellow', 'green', 'blue', 
                 'purple', 'black', 'gray', 'white']
  });
};

/** 
 * Helper function for rendering error page; this code needed in every
 * function that makes a request, so this function prevents rewriting
 * same code
 */
function renderError(page, response, body, res)
{
  console.log(body);
  res.render(page, 
  {
    errorStatus: response.statusCode+': '+response.statusMessage,
    errorMessage: body.error || body.message
  });
}

