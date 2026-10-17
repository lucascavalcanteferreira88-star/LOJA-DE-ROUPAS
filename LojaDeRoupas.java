import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * Exemplo em Java para a loja de roupas.
 * Este programa de console apresenta produtos e calcula o valor de uma compra.
 *
 * Para executar:
 *   javac LojaDeRoupas.java
 *   java LojaDeRoupas
 */
public class LojaDeRoupas {

    static class Produto {
        private final String nome;
        private final double preco;

        Produto(String nome, double preco) {
            this.nome = nome;
            this.preco = preco;
        }

        String getNome() {
            return nome;
        }

        double getPreco() {
            return preco;
        }
    }

    public static void main(String[] args) {
        List<Produto> produtos = new ArrayList<>();
        produtos.add(new Produto("Camiseta", 49.90));
        produtos.add(new Produto("Calça jeans", 119.90));
        produtos.add(new Produto("Moletom", 89.90));
        produtos.add(new Produto("Vestido", 99.90));

        Scanner scanner = new Scanner(System.in);
        double total = 0.0;

        System.out.println("================================");
        System.out.println("       LOJA DE ROUPAS");
        System.out.println("================================");
        System.out.println("Produtos disponíveis:");

        for (int i = 0; i < produtos.size(); i++) {
            Produto produto = produtos.get(i);
            System.out.printf("%d. %s - R$ %.2f%n",
                    i + 1, produto.getNome(), produto.getPreco());
        }

        System.out.println("Digite o número do produto para adicionar ao carrinho.");
        System.out.println("Digite 0 para finalizar a compra.");

        while (true) {
            System.out.print("Produto: ");

            if (!scanner.hasNextInt()) {
                System.out.println("Digite um número válido.");
                scanner.next();
                continue;
            }

            int escolha = scanner.nextInt();

            if (escolha == 0) {
                break;
            }

            if (escolha < 1 || escolha > produtos.size()) {
                System.out.println("Opção inválida. Escolha um produto da lista.");
                continue;
            }

            Produto escolhido = produtos.get(escolha - 1);
            total += escolhido.getPreco();
            System.out.printf("%s adicionado ao carrinho. Subtotal: R$ %.2f%n",
                    escolhido.getNome(), total);
        }

        System.out.println("--------------------------------");
        System.out.printf("Total da compra: R$ %.2f%n", total);
        System.out.println("Obrigado por comprar conosco!");
        scanner.close();
    }
}
