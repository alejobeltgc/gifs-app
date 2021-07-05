import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../Interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = []
  private apiKey: string = 'wXV2f3bs0oeuCXotJ6VRUi968z63D2aa'
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'
  public resultados: Gif[] = []

  constructor(private http: HttpClient) { 
    this._historial = JSON.parse( localStorage.getItem('busquedas')!) || []
    this.resultados = JSON.parse( localStorage.getItem('resultados')!) || []
    // if( localStorage.getItem('busquedas') ){
    //   this._historial = JSON.parse( localStorage.getItem('busquedas')! )
    // }
  }

  get historial(){
    return [...this._historial]
  }

  buscarGifs(query: string){

    query = query.trim().toLowerCase()
    
    if( !this._historial.includes( query ) ){
      this._historial.unshift( query )
      this._historial = this._historial.splice(0,10)

      localStorage.setItem('busquedas', JSON.stringify( this._historial ) )
    }

    const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('q', query)
        .set('limit', '10')

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe( ( resp ) => {
        //console.log(resp.data)
        this.resultados = resp.data
        localStorage.setItem('resultados', JSON.stringify(resp.data))
      })
    
  }
}
