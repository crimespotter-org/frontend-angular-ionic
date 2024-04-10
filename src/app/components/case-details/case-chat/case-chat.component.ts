import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IonButton, IonInput, IonItem, IonLabel} from "@ionic/angular/standalone";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SupabaseService} from "../../../services/supabase.service";
import {StorageService} from "../../../services/storage.service";

@Component({
  selector: 'app-case-chat',
  templateUrl: './case-chat.component.html',
  styleUrls: ['./case-chat.component.scss'],
  imports: [
    IonLabel,
    IonItem,
    NgIf,
    IonInput,
    FormsModule,
    IonButton,
    DatePipe,
    NgForOf
  ],
  standalone: true
})
export class CaseChatComponent  implements OnInit, OnDestroy {
  @Input() caseId: any;
  comments: any[] = [];
  newCommentText?: string | null = '';
  userId: string | null = '';

  constructor(private supabaseService: SupabaseService, private storageService: StorageService) {}

  ngOnInit() {
    this.loadComments();
    this.userId = this.storageService.getUserId();
    this.subscribeToComments();
  }

  ngOnDestroy() {
    this.supabaseService.subscribeToComments(this.caseId, (newComment: any) => {
      this.comments.push(newComment);
    });
  }

  async loadComments() {
    this.supabaseService.getCommentsByCaseId(this.caseId).then(comments => {
      this.comments = comments;
    });
  }

  addComment() {
    if (this.newCommentText && !this.newCommentText.trim()) return;

    if (this.userId && this.newCommentText) {
      this.supabaseService.addComment(this.caseId, this.userId, this.newCommentText).then(() => {
        this.newCommentText = '';
      });
    }

  }

  subscribeToComments() {
    this.supabaseService.subscribeToComments(this.caseId, (newComment: any) => {
      console.log(this.comments)

      this.comments.push(newComment);
    });
  }

}
