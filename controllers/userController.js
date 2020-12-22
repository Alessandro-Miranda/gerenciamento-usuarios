class UserController
{
    constructor(formIdCreate, formIdUpdate, tableId)
    {
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
    }

    onEdit()
    {
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", () => {
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener('submit', e => {
            e.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");
            btn.disabled = true;
            let values = this.getValues(this.formUpdateEl);
            
            let index = this.formUpdateEl.dataset.trindex;
            let tr = this.tableEl.rows[index];
            tr.dataset.user = JSON.stringify(values);

            tr.innerHTML = `<td>
                                <img src="${values.photo}" alt="User Image" class="img-circle img-sm">
                            </td>
                            <td>${values.name}</td>
                            <td>${values.email}</td>
                            <td>${values.admin ? "sim" : "não"}</td>
                            <td>${Utils.dateFormat(values.register)}</td>
                            <td>
                                <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                            </td>`;

            this.addEventsTr(tr);
            this.updateCount();
        });
    }

    onSubmit()
    {   
        this.formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            let btn = this.formEl.querySelector("[type=submit]");
            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if(!values) return false;

            this.getPhoto().then((content) => {
                values.photo = content;
                this.addLine(values);

                this.formEl.reset();
                btn.disabled = false;
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
            if(file)
            {
                fileReader.readAsDataURL(file);
            }
            else
            {
                resolve("dist/img/boxed-bg.jpg");
            }
        });
    }
    getValues(formEl)
    {
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(field => {
            // Verifica se os itens que estão passando no array são algum desses campos
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value)
            {
                field.parentElement.classList.add("has-error");
                isValid = false;
            }
            
            if(field.name == "gender")
            {
                if(field.checked)
                {   
                    user[field.name] = field.value; // forma de criar o json de maneira dinâmica
                }
            }
            else if(field.name === "admin")
            {
                field.checked ? user[field.name] = true : user[field.name] = false;
            }
            else
            {
                user[field.name] = field.value;
            }
        });
        if(!isValid)
        {
            return false;
        }
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
        let tr = document.createElement("tr");

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `<td>
                            <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
                        </td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${dataUser.admin ? "sim" : "não"}</td>
                        <td>${Utils.dateFormat(dataUser.register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>`;

        this.addEventsTr(tr);

        
        this.tableEl.appendChild(tr);
        
        this.updateCount();
    }
    
    addEventsTr(tr)
    {
        tr.querySelector(".btn-edit").addEventListener('click', () => {
    
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");
    
            form.dataset.trindex = tr.sectionRowIndex;
    
            for(let name in json)
            {
                let field = form.querySelector("[name=" + name.replace("_", "") + "]");
                
                if(field)
                {
                    switch(field.type)
                    {
                        case 'file':
                            continue;
    
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;
    
                        case 'checkbox':
                            field.checked = json[name];
                        break;
    
                        default:
                            field.value = json[name];
                    }
                    field.value = json[name];
                }
            }
            this.showPanelUpdate();
        });
    }

    showPanelCreate()
    {
        document.querySelector('#box-user-create').style.display = "block";
        document.querySelector('#box-user-update').style.display = "none";
    }
    showPanelUpdate()
    {
        document.querySelector('#box-user-create').style.display = "none";
        document.querySelector('#box-user-update').style.display = "block";
    }

    updateCount()
    {
        let numberUsers = 0, numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers++;

            let user = JSON.parse(tr.dataset.user)
            if(user._admin) numberAdmin++;
        });

        document.querySelector("#number-users").textContent = numberUsers;
        document.querySelector("#number-users-admin").textContent = numberAdmin;
    }
}