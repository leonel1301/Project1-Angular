import { DialogRef } from '@angular/cdk/dialog';
import { Component, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss'],
})
export class MovieFormComponent {
  movieForm: FormGroup;

  movieId: number | string | undefined = undefined;
  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private dialogRef: DialogRef<MovieFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movie?: Movie }
  ) {
 if (data?.movie) {
    this.movieId = data.movie.id;
    this.movieForm = this.fb.group({
      title: [data.movie.title, Validators.required],
      rating: [data.movie.rating, Validators.required],
      year: [data.movie.year, Validators.required],
      image: [data.movie.image, Validators.required],
    });
  } else {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      rating: ['', Validators.required],
      year: ['', Validators.required],
      image: ['', Validators.required],
    });
    }
  }

  onFormSubmit() {
    if (this.movieForm.valid) {
      if (this.movieId == undefined) {
        this.movieService.createItem(this.movieForm.value).subscribe({
          next: (data) => {
            console.log('Movie created', data);
            this.dialogRef.close();
          },
          error: (error) => {
            console.error('There was an error!', error);
          },
        });
      } else {
        this.movieService
          .updateItem(this.movieId ? this.movieId : -1, this.movieForm.value)
          .subscribe({
            next: (data) => {
              console.log('Movie Updated', data);
              this.dialogRef.close();
            },
            error: (error) => {
              console.error('There was an error!', error);
            },
          });
      }
    }
  }
}
