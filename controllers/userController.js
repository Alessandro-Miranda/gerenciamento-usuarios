class UserController
{
    constructor(formId, tableId)
    {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
    }

    onSubmit()
    {   // Verificar essa função no ambiente local para verificar a funcionalidade
        this.formEl.addEventListener("submit", (e) => {
            e.preventDefault();

            let values = this.getValues();

            this.getPhoto().then((content) => {
                values.photo = content;
                this.addLine(this.getValues())
            },
            (e) => {
                console.error(e);
            });
        });
    }
    getPhoto()
    {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
    
            let elements = [...this.formEl.elements].filter(item => {
                return item.name === 'photo' && item;
            });
            let file = elements[0].files[0];
    
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (e) => {
                reject(e);
            }
            fileReader.readAsDataURL(file);
        });
    }
    getValues()
    {
        let user = {};

        [...this.formEl.elements].forEach(field => {
            if(field.name === "gender")
            {
                if(field.checked)
                {   
                    user[field.name] = field.value; // forma de criar o json de maneira dinâmica
                }
            }
            else
            {
                user[field.name] = field.value;
            }
        });
    
        return new User(user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin);
    }
    addLine(dataUser)
    {
        this.tableEl.innerHTML += `<tr>
                                        <td>
                                            <img src=${dataUser.photo} alt="User Image" class="img-circle img-sm">
                                        </td>
                                        <td>${dataUser.name}</td>
                                        <td>${dataUser.email}</td>
                                        <td>${dataUser.admin}</td>
                                        <td>${dataUser.birth}</td>
                                        <td>
                                            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                                        </td>
                                    </tr>
                                `;
    }
}