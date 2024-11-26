import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProductoModel } from './model/producto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crud_app';

  productObj:ProductoModel = new ProductoModel();
  productForm:FormGroup = new FormGroup({});
  productList:ProductoModel[] = [];

  constructor()
  {
    this.crearFormulario();
    const oldData = localStorage.getItem("dataProd");
    if(oldData!=null)
    {
      //Convirtiendo los datos a tipo JSON
      const parseData = JSON.parse(oldData);
      this.productList = parseData;
    }
  
  }

  crearFormulario()
  {
    this.productForm = new FormGroup({
      id: new FormControl(this.productObj.id),
      descripcion: new FormControl(this.productObj.descripcion, [Validators.required]),
      precio: new FormControl(this.productObj.precio, [Validators.required, Validators.minLength(3)])
    });
  }

  onSave(){
    //Recuperamos lo que hay en el almacenamiento local
    const oldData = localStorage.getItem("dataProd");
    if(oldData!=null)
    {
      //Convirtiendo los datos a tipo JSON
      const parseData = JSON.parse(oldData);
      this.productForm.controls['id'].setValue(parseData.length+1)
      //Guardar registro en almacenamiento local
      this.productList.unshift(this.productForm.value)
    }
    else
    {
      this.productList.unshift(this.productForm.value)
    }
    //Guardar registro en almacenamiento local
    localStorage.setItem("dataProd", JSON.stringify(this.productList));
    this.limpiar();
  }

  onEdit(item:ProductoModel)
  {
   this.productObj=item;
   this.crearFormulario(); 
  }
  
  limpiar(){
    this.productObj=new ProductoModel;
    this.crearFormulario();
  }

  onUpdate()
  {
    const registro = this.productList.find(m=>m.id == this.productForm.controls['id'].value);
    if(registro !=undefined){
      registro.descripcion = this.productForm.controls['descripción'].value;
      registro.precio = this.productForm.controls['precio'].value;
    }
    //Guardar registro en almacenamiento local
    localStorage.setItem("dataProd", JSON.stringify(this.productList));
    this.limpiar();
  }

  onDelete(id:number){
    const borrar = confirm("Estás seguro de eliminar este registro");
    if (borrar)
      {
        const indice = this.productList.findIndex(m=>m.id);
        this.productList.splice(indice,1);
    }
    localStorage.setItem("dataProd", JSON.stringify(this.productList));
  }

}
