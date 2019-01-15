import { observable, action, runInAction, autorun } from 'mobx';
import { User } from 'firebase';
import firebaseApp from './firebase/Firebase';
import { Adventure } from './vo/adventure';

export class Model {
  private static _instance: Model;

  public static get instance(): Model {
    if (!this._instance) {
      this._instance = new Model();
    }
    return this._instance;
  }

  @observable user: User | null | undefined;
  @observable adventuresForUser: Adventure[] | undefined;
  @observable selectedAdventureId: string;
  @observable selectedAdventure: Adventure;

  @action setSelectedAdventureId(id: string) {
    this.selectedAdventureId = id;
  }

  private watchCancellerAdventuresForUser: ((a: firebase.database.DataSnapshot | null, b?: string) => any) | undefined;
  private watchCancellerSelectedAdventure: ((a: firebase.database.DataSnapshot | null, b?: string) => any) | undefined;

  constructor() {
    this.startFirebaseMonitoring();
  }

  private startFirebaseMonitoring() {
    // set the currently logged in user
    firebaseApp.auth().onAuthStateChanged((user) => {
      runInAction(() => {
        this.user = user;
      });
    });

    // set the current adventures for the current user
    autorun(() => {
      if (this.watchCancellerAdventuresForUser) {
        this.watchCancellerAdventuresForUser(null);
        this.watchCancellerAdventuresForUser = undefined;
      }
      if (this.user) {
        let adventures = firebaseApp.database().ref('adventures')
          .orderByChild('members/' + this.user.uid).startAt(0);

        this.watchCancellerAdventuresForUser = adventures.on('value', (snapshot: any) => {
          let adventuresForUser: Adventure[] = [];
          if (snapshot) {
            snapshot.forEach(function (data: any) {
              let item = data.val();
              let key = data.key;
              item.key = key;
              adventuresForUser.push(new Adventure(item));
            });
          }
          runInAction(() => {
            this.adventuresForUser = adventuresForUser;
          });
        });
      }
    });

    // load the selected adventure
    autorun(() => {
      if (this.watchCancellerSelectedAdventure) {
        this.watchCancellerSelectedAdventure(null);
        this.watchCancellerSelectedAdventure = undefined;
      }
      if (this.selectedAdventureId ) {
        let ref = 'adventures/' + this.selectedAdventureId;
        console.log(ref);
        let adventure = firebaseApp.database().ref(ref);

        this.watchCancellerSelectedAdventure = adventure.on('value', (snapshot: any) => {
          
          if (snapshot) {
            runInAction(() => {
              this.selectedAdventure = new Adventure(snapshot.val());
              this.selectedAdventure.key = this.selectedAdventureId;
            });
          }
        });
      }
    });
  }



}
