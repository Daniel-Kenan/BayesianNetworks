import norsys.netica.*;

public class Main {

    public static void main(String[] args) {
        try {
            Netica.initialize();
            Environ env = new Environ("+Netscape");
            Net net = new Net();
            net.readFile("case.dne", env);

            System.out.println("Network loaded successfully:");
            System.out.println("Number of nodes: " + net.getNumberOfNodes());
            System.out.println("Number of edges: " + net.getNumberOfEdges());

            NodeList nodes = net.getNodes();
            for (Node node : nodes) {
                if (node.getKind() == NodeType.CPT) {
                    // node.finding().enterFinding("StateName");
                }
            }

            net.compile();
            net.finalize();

            for (Node node : nodes) {
                if (node.getKind() == NodeType.CPT) {
                    System.out.println("Node: " + node.getName());
                    System.out.println("Belief: " + node.getBelief("StateName"));
                }
            }

            Netica.cleanup();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
