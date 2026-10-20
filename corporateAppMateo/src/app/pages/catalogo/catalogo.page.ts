import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular';
import { Post } from '../../models/posts.model';
import { PostService } from '../../services/post';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ]
})
export class CatalogoPage implements OnInit {
  private postService = inject(PostService);
  private changeDetector = inject(ChangeDetectorRef);

  posts: Post[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error crítico al conectar con la API';
        this.loading = false;
        this.changeDetector.markForCheck();
      }
    });
  }
}