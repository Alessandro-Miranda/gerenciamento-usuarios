var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

fields.forEach(field => {
    if(field.name === "gender")
    {
        if(field.checked)
        {   // forma de criar o json de maneira dinâmica
            user[field.name] = field.value;
        }
    }
    else
    {
        user[field.name] = field.value;
    }
});

document.getElementById("form-user-create").addEventListener("submit", function(){
    alert("funcionou");
});
