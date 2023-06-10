num_item=1
valor_compra = float(input(f'Digite o valor do item {num_item}: '))
num_item=num_item+1
soma_compra = valor_compra


while valor_compra != 0:
    valor_compra = float(input(f'Digite o valor do item {num_item}: '))
    num_item = num_item+1
    soma_compra = soma_compra+valor_compra

    if valor_compra<0:
        num_item=num_item-1
        soma_compra=soma_compra-valor_compra
        valor_compra = float(input(f'Valor inválido. Por favor, digite novamente o valor do item {num_item}: '))
        soma_compra = soma_compra+valor_compra
        num_item=num_item+1


if valor_compra == 0:
    msg = input('\nDeseja realmente finalizar a compra? (S=Sim/N=Não) ')

    if msg.upper() == 'S':
        total_itens = num_item-2
        print(f'\n\nVenda finalizada com {total_itens} itens.\n\nO valor total da compra foi R$ {soma_compra:.2f}\n.')

    else:
        while msg.upper() == 'N':
            valor_compra = float(input(f'Digite o valor do item {num_item}: '))
            num_item = num_item+1
            soma_compra = soma_compra+valor_compra
            if valor_compra<0:
                num_item=num_item-1
                soma_compra=soma_compra-valor_compra
                valor_compra = float(input(f'Valor inválido. Por favor, digite novamente o valor do item {num_item}: '))
                soma_compra = soma_compra+valor_compra
                num_item=num_item+1
            if valor_compra == 0:
                msg = input('\nDeseja realmente finalizar a compra? (S=Sim/N=Não) ')
                if msg.upper() == 'S':
                    total_itens = num_item-2
                    print(f'\n\nVenda finalizada com {total_itens} itens.\nO valor total da compra foi R$ {soma_compra:.2f}.\n')