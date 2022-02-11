#include<stdio.h>
#define N 4
#define TRUE 1
#define FALSE 0

int masu[N][N];

void printans()//結果を出力                                                              
{
  int i,j;
  for(i=0;i<N;i++){
    for(j=0;j<N;j++){
      printf("%2d",masu[i][j]);
    }
    printf("\n");
  }
  //printf("\n");                                                                        
}


int check(int x,int y,int num)//判定用                                                   
{
  int i,j,s,t;
  for(i=0;i<N;i++)
    {
      if(masu[x][i]==num)return FALSE;//行判定                                           
      if(masu[i][y]==num)return FALSE;//列判定                                           
    }
  s=(x/2)*2;
  t=(y/2)*2;

  for(i=0;i<2;i++)
    {
      for(j=0;j<2;j++)
        {
          if(masu[s+i][t+j]==num)return FALSE;//2x2のマスに同じ数字                     
        }
    }
  return TRUE;//判定ok                                                                   
}

void recursive(int n)//再帰n<16までfrom[0][0]to[4][4]                                    
{
  int i,j,k;
  if(n > 15)
    {
      printans();
      return;
    }
  i=n / 4;//行                                                                           
  j=n % 4;//列                                                                           

  if(masu[i][j] > 0)
    {
      recursive(n+1);//既に存在                                                          
    }

  else
    {
      for(k=1;k<5;++k)
        {
          if(check(i,j,k)> 0)//ここで判定を入れてTRUEならmasuに値代入                    
            {
              masu[i][j] = k;
              recursive(n+1);//他の可能性列を考えて再帰                          
              masu[i][j] = 0;//ここでmasuを初期化（<0）にしないと動作しない              
            }
        }
    }
}


int main()
{

  int i,j;
  FILE *fp;
  fp=fopen("sudoku1.txt","r");
  for(i=0;i<N;i++){
    for(j=0;j<N;j++){
      fscanf(fp,"%d,",&masu[i][j]);
    }
  }
  fclose(fp);

  recursive(0);
  return 0;
}


