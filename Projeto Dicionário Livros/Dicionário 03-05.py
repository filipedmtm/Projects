#CAIO CEZAR GANDARA DOS SANTOS - RA 23015616 // FILIPE DANIEL MEDEIROS T. MOTA RA 23002322

quest = input("Desejas inserir um livro? (S/N) ")

if quest.upper() == "S":
    N = int(input("Quanto livros deseja inserir no dicionário? "))

    biblioteca = {}

    for livros in range(N):
        info = []
        print("---------------------------------------------")
        codigo = int(input("Digite o código do livro: "))
        titulo = input("Nome do Livro: ")
        info.append(titulo)
        numero_autores = int(input("Quantidade de autores: "))
        info.append(numero_autores)
        if numero_autores > 1:
            lista_autores=[]
            for x in range(numero_autores):
                nome_autores = input(f"Digite o nome do {x+1}º autor: ")
                lista_autores.append(nome_autores)
            info.append(lista_autores)
        else:
            nome_autor = input("Digite o nome do autor: ")
            info.append(nome_autor)
        preco = int(input("Preço do livro R$"))
        info.append(preco)
        biblioteca[codigo] = info
     
else: 
    print("Biblioteca encerrada.")
print("-----------------------------------------------------")   
ask2 = input("\nDeseja consultar um livro? (S/N) ")
if ask2.upper() == 'S':
    while True:
        ask3 = input("Deseja consultar pelo código ou pelo nome do livro? (C/N) ")        
        if ask3.upper() == 'C':
            try:
                ask4 = int(input("Qual é o código do livro? "))
                print(biblioteca[ask4])
                print("Livro encontrado!\nBiblioteca Finalizada.")
                
                break
            except ValueError:
                print ("Código inválido!")
        elif ask3.upper() == 'N':
            try:
                ask5 = input("Qual é o nome do livro? ")
                for x in biblioteca.values():
                    if ask5 in x:
                        print(x)
                        print("Livro encontrado!\nBiblioteca Finalizada.")
                break
            except ValueError:
                print("Nome inválido!")
        else:
            print("Opção inválida!")
else:
    print("Finalizado.")

ask6=input('Digite "L" para ver a lista de livros com valor maior que R$ 50,00')
if ask6.upper()=='L':
    for book in biblioteca.values():
        if book[3]>50:
            print(f'\nNome do livro: {book[0]}\tNº de autores: {book[1]}\tAutores: {book[2]}\tPreço: R${book[3]}\n')
        else:
            ('Não há livros com o valor desejado para serem exibidos.')
else:
    print('Ok. Programa finalizado')










