export async function simpleErrorHandler(func, ...params) {
    const response = await func(...params);

    if(response.success == false) {
        alert(response.data);        
    }

    return response
}