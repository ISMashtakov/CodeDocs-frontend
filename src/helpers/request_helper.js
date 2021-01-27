export async function post(url = '', data = {}) {

    var params = ""
    for (var key in data)
    {
    params += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`
    }
    
    if(params.endsWith("&"))
    params = params.slice(0,-1)
    const response = await fetch(url, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params
    });
    return response
    }
    
    export async function get(url = '', data = {}) {
    
    var params = ""
    for (var key in data)
    {
    params += `${key.replaceAll("&", "%26")}=${data[key].replaceAll("&", "%26")}&`
    }
    
    if(params.endsWith("&"))
    params = params.slice(0,-1)
    const response = await fetch(url + "?" + params);
    return response
    }
    
    var now_updating = {}
    
    export async function asyncUpdateDate(name, func, can_repeat=false)
    {
    if(name in now_updating)
    {
    if(can_repeat)
    {
    now_updating[name]++;
    }
    else
    {
    return null;
    }
    }
    else
    {
    now_updating[name] = 1;
    }
    func();
    now_updating[name]--;
    }