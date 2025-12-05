import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, delay } from 'rxjs';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  actors: string[];
  rating: number; 
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  public menuItems = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItems.asObservable();
  
  public cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();
  
  private categories = new BehaviorSubject<Category[]>([
    { id: 'all', name: 'Все фильмы' },
    { id: 'action', name: 'Боевики' },
    { id: 'comedy', name: 'Комедии' },
    { id: 'drama', name: 'Драмы' },
    { id: 'fantasy', name: 'Фэнтези' },
    { id: 'horror', name: 'Ужасы' },
    { id: 'sci-fi', name: 'Фантастика' },
    { id: 'romance', name: 'Мелодрамы' }
  ]);
  public categories$ = this.categories.asObservable();

  private selectedCategory = new BehaviorSubject<string>('all');
  public selectedCategory$ = this.selectedCategory.asObservable();

  private localMenuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Властелин колец: Братство кольца',
      description: 'Эпическое фэнтези о хоббите Фродо, который должен уничтожить Кольцо Всевластия в огне Роковой горы',
      price: 1500,
      image: 'https://ik.imagekit.io/faiflswaf/hocmarketing-org/08/27/og-43731-the-ultimate-guide-to-reading-tolkiens-books-unveiling-the-perfect-order-for-lotr-fans?tr=w-600,h-400',
      category: 'fantasy',
      actors: ['Элайджа Вуд', 'Иэн Маккеллен', 'Вигго Мортенсен', 'Орландо Блум'],
      rating: 4.9 
    },
    {
      id: 2,
      name: 'Начало',
      description: 'Криминальный триллер о ворах, которые внедряются в сны людей чтобы украсть их идеи',
      price: 1200,
      image: 'https://www.film.ru/sites/default/files/styles/thumb_600x400/public/articles/17071995-859972.jpg',
      category: 'sci-fi',
      actors: ['Леонардо ДиКаприо', 'Марион Котийяр', 'Том Харди', 'Эллен Пейдж'],
      rating: 4.8 
    },
    {
      id: 3,
      name: 'Крестный отец',
      description: 'Эпическая сага о семье мафиози Корлеоне и их борьбе за власть в преступном мире',
      price: 1100,
      image: 'https://avatars.mds.yandex.net/i?id=ba97b4d8b95aa5e07775db3f1b73a3f5_l-7054477-images-thumbs&n=13',
      category: 'drama',
      actors: ['Марлон Брандо', 'Аль Пачино', 'Джеймс Каан', 'Роберт Дюваль'],
      rating: 4.9
    },
    {
      id: 4,
      name: 'Темный рыцарь',
      description: 'Бэтмен сталкивается с главным испытанием в лице Джокера - анархиста, сеющего хаос в Готэме',
      price: 1300,
      image: 'https://www.indiewire.com/wp-content/uploads/2018/10/the-dark-knight-christian-bale.jpg?w=600&h=400&crop=1',
      category: 'action',
      actors: ['Кристиан Бейл', 'Хит Леджер', 'Аарон Экхарт', 'Мэгги Джилленхол'],
      rating: 4.9 
    },
    {
      id: 5,
      name: 'Побег из Шоушенка',
      description: 'История невиновного банкира, приговоренного к пожизненному заключению, и его пути к свободе',
      price: 1000,
      image: 'https://tv.pgtrk.com/sites/default/files/show/2017/12/esaretin-bedeli-turkce-dublaj-full-hd-izle-521.jpg',
      category: 'drama',
      actors: ['Тим Роббинс', 'Морган Фриман', 'Боб Гантон', 'Джеймс Уитмор'],
      rating: 4.9 
    },
    {
      id: 6,
      name: 'Форрест Гамп',
      description: 'История простого человека с добрым сердцем, который невольно становится свидетелем ключевых событий американской истории',
      price: 1050,
      image: 'https://avatars.mds.yandex.net/i?id=66e4b75da6f5a9d0cfc80d278a91e40f_l-5222073-images-thumbs&n=13',
      category: 'drama',
      actors: ['Том Хэнкс', 'Робин Райт', 'Гэри Синиз', 'Салли Филд'],
      rating: 4.8 
    },
    {
      id: 7,
      name: 'Матрица',
      description: 'Хакер Нео discovers that his world is a simulation and joins a rebellion against its machine overlords',
      price: 1250,
      image: 'https://www.film.ru/sites/default/files/styles/thumb_600x400/public/articles/44271663-1089252.jpg',
      category: 'sci-fi',
      actors: ['Киану Ривз', 'Лоренс Фишберн', 'Керри-Энн Мосс', 'Хьюго Уивинг'],
      rating: 4.7 
    },
    {
      id: 8,
      name: 'Криминальное чтиво',
      description: 'Переплетающиеся истории лос-анджелесских бандитов, наемных убийц и их приятелей',
      price: 1150,
      image: 'https://www.film.ru/sites/default/files/styles/thumb_600x400/public/articles/42948379-1077495.jpg',
      category: 'action',
      actors: ['Джон Траволта', 'Сэмюэл Л. Джексон', 'Ума Турман', 'Брюс Уиллис'],
      rating: 4.8 
    },
    {
      id: 9,
      name: 'Зеленая миля',
      description: 'Надзиратель тюрьмы узнает, что один из заключенных обладает сверхъестественными способностями',
      price: 1100,
      image: 'https://avatars.mds.yandex.net/i?id=8661ae9bd15d37092b0150e584f5e11a_l-4055677-images-thumbs&n=13',
      category: 'drama',
      actors: ['Том Хэнкс', 'Майкл Кларк Дункан', 'Дэвид Морс', 'Бонни Хант'],
      rating: 4.8 
    },
    {
      id: 10,
      name: 'Интерстеллар',
      description: 'Группа исследователей путешествует через червоточину в космосе в поисках нового дома для человечества',
      price: 1400,
      image: 'https://www.film.ru/sites/default/files/styles/epsa_600x400/public/articles/49632226-1376988.jpg',
      category: 'sci-fi',
      actors: ['Мэттью Макконахи', 'Энн Хэтэуэй', 'Джессика Честейн', 'Майкл Кейн'],
      rating: 4.7 
    },
    {
      id: 11,
      name: 'Однажды в Голливуде',
      description: 'История актера и его дублера, пытающихся найти свое место в быстро меняющемся Голливуде 1969 года',
      price: 1200,
      image: 'https://avatars.mds.yandex.net/i?id=64888715a05533f1102400e8a25653d6_l-3829399-images-thumbs&n=13',
      category: 'comedy',
      actors: ['Леонардо ДиКаприо', 'Брэд Питт', 'Марго Робби', 'Аль Пачино'],
      rating: 4.6 
    },
    {
      id: 12,
      name: 'Оно',
      description: 'Группа детей сталкивается со злобным существом, принимающим облик их самых страшных кошмаров',
      price: 1300,
      image: 'https://u.livelib.ru/reader/Navigator/r/gmk3ymch/gmk3ymch-r.jpg',
      category: 'horror',
      actors: ['Билл Скарсгард', 'Джэйден Мартел', 'София Лиллис', 'Финн Вулфхард'],
      rating: 4.5 
    },
    {
      id: 13,
      name: 'Запах женщины',
      description: 'Молодой студент нанимается ухаживать за слепым, циничным отставным подполковником',
      price: 950,
      image: 'https://www.film.ru/sites/default/files/styles/thumb_600x400/public/filefield_paths/zapah-zhenshhiny_004.jpg',
      category: 'drama',
      actors: ['Аль Пачино', 'Крис О\'Доннелл', 'Джеймс Ребхорн', 'Габриэль Анвар'],
      rating: 4.7 
    },
    {
      id: 14,
      name: 'Джентльмены',
      description: 'Американский наркобарон пытается продать свою прибыльную империю сети богатых олигархов',
      price: 1250,
      image: 'https://avatars.mds.yandex.net/i?id=a034b1d0c71ab7573bd0b47f41fc8089aae315b8-4034271-images-thumbs&n=13',
      category: 'action',
      actors: ['Мэттью Макконахи', 'Чарли Ханнэм', 'Хью Грант', 'Мишель Докери'],
      rating: 4.6 
    },
    {
      id: 15,
      name: 'Ла-Ла Ленд',
      description: 'История любви джазового музыканта и начинающей актрисы, пытающихся найти себя в Лос-Анджелесе',
      price: 1100,
      image: 'https://avatars.mds.yandex.net/i?id=2cefd9c986828e447c7113170288e513_l-7698965-images-thumbs&n=13',
      category: 'romance',
      actors: ['Райан Гослинг', 'Эмма Стоун', 'Джон Ледженд', 'Розмари ДеУитт'],
      rating: 4.7 
    }
  ];

  constructor(private http: HttpClient) {}

  getItems(query?: string): Observable<MenuItem[]> {
    return of(this.localMenuItems).pipe(

      map(items => {
        if (query) {
          const lowerQuery = query.toLowerCase();
          return items.filter(item => 
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery) ||
            item.actors.some(actor => actor.toLowerCase().includes(lowerQuery))
          );
        }
        return items;
      }),
      catchError(() => of(this.localMenuItems))
    );
  }

  getItemById(id: number): Observable<MenuItem | undefined> {
    return of(this.localMenuItems.find(item => item.id === id)).pipe(

    );
  }

  loadMenuItems(): void {
    this.menuItems.next(this.localMenuItems);
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory.next(category);
  }

  addToCart(item: MenuItem): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(cartItem => cartItem.menuItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({ menuItem: item, quantity: 1 });
    }
    
    this.cartItems.next([...currentCart]);
  }

  removeFromCart(itemId: number): void {
    const currentCart = this.cartItems.value.filter(item => item.menuItem.id !== itemId);
    this.cartItems.next(currentCart);
  }

  updateQuantity(itemId: number, quantity: number): void {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(cartItem => cartItem.menuItem.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentCart]);
      }
    }
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => 
      total + (item.menuItem.price * item.quantity), 0
    );
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  addMenuItem(item: Omit<MenuItem, 'id'>): void {
    const currentItems = this.menuItems.value;
    const newItem: MenuItem = {
      ...item,
      id: Date.now()
    };
    
    this.menuItems.next([...currentItems, newItem]);
  }
}