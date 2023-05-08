import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MovieService } from 'src/app/services/movie.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieFormComponent } from 'src/app/movie-form/movie-form.component';
import { Movie } from 'src/app/models/movie';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  displayedColumns: string[] = ['id', 'title', 'rating', 'year', 'image', 'action'];//un array de strings que contiene los nombres de las columnas a mostrar en la tabla.
  dataSource: MatTableDataSource<any>;//instancia de MatTableDataSource que almacenará los datos de las películas.

  @ViewChild(MatPaginator) paginator!: MatPaginator;// se utilizan para acceder a elementos del DOM (MatPaginator y MatSort)
  @ViewChild(MatSort) sort!: MatSort;// y establecerlos en la tabla.

  constructor(private movieService: MovieService, private dialog: MatDialog) {//se inyectan los servicios necesarios (MovieService y MatDialog) 
    this.dataSource = new MatTableDataSource();//y se inicializa la instancia de MatTableDataSource.
  }

  ngAfterViewInit() {//se ejecuta después de que la vista del componente se haya inicializado. 
    this.dataSource.paginator = this.paginator;//Aquí se asignan el paginador y el ordenador a la tabla.
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {//se ejecuta al inicializar el componente y llama al método getMovies() para cargar los datos de las películas.
    this.getMovies();
  }

  getMovies() {//obtiene la lista de películas desde el servicio MovieService y asigna los datos al dataSource.
    this.movieService.getList().subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {//aplica un filtro de búsqueda en la tabla y, si existe, vuelve a la primera página del paginador.
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {//abre el componente MovieFormComponent como un diálogo para agregar una nueva película.
    this.dialog.open(MovieFormComponent);
  }

  editMovie(id: number) {//busca la película por su ID, abre el componente MovieFormComponent en un diálogo para editarla y actualiza la lista de películas al cerrar el diálogo.
    const movie = this.dataSource.data.find((m: Movie) => m.id === id);
    if (movie) {
      const dialogRef = this.dialog.open(MovieFormComponent, {
        data: {
          movie: movie,
        },
      });

      // Subscribe to the afterClosed event of the dialog
      dialogRef.afterClosed().subscribe(() => {
        this.getMovies();
      });
    }
  }

  deleteMovie(id: string) {
    this.movieService.deleteItem(id).subscribe(
      () => {
        this.getMovies();
        alert('Movie deleted');
      },
      (error: any) => {
        alert('There was an error!');
        console.error(error);
      }
    );
  }
}
