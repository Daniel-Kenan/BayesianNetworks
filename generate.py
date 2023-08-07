from pgmpy.models import BayesianNetwork
from pgmpy.factors.discrete import TabularCPD

# Create a Bayesian Network object
net = BayesianNetwork()

# Define the names of the nodes
discharge = 'discharge'
cover = 'cover'
fish = 'fish'
migration = 'migration'
barriers = 'barriers'

# Add nodes to the network
net.add_node(discharge)
net.add_node(cover)
net.add_node(fish)
net.add_node(migration)
net.add_node(barriers)

# Add edges between nodes
net.add_edge(discharge, cover)
net.add_edge(discharge, fish)
net.add_edge(barriers, migration)
net.add_edge(cover, fish)
net.add_edge(migration, fish)

# Define Conditional Probability Tables (CPTs)
cpd_cover = TabularCPD(variable=cover, variable_card=4,
                       values=[[1.0, 0.0, 0.0, 0.0],
                               [0.25, 0.50, 0.25, 0.0],
                               [0.0, 0.04, 0.01, 0.95],
                               [0.0, 0.0, 0.0, 1.0]],
                       evidence=[discharge],
                       evidence_card=[4])

cpd_migration = TabularCPD(variable=migration, variable_card=4,
                           values=[[0.95, 0.05, 0.0, 0.0],
                                   [0.50, 0.20, 0.20, 0.10],
                                   [0.25, 0.25, 0.25, 0.25],
                                   [0.0, 0.0, 0.0, 1.0]],
                           evidence=[barriers],
                           evidence_card=[4])

cpd_fish = TabularCPD(variable=fish, variable_card=4,
                      values=[[1.0, 0.8, 0.6, 0.0, 0.8, 0.25, 0.0, 0.0, 0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                              [0.0, 0.2, 0.2, 0.0, 0.2, 0.5, 0.5, 0.0, 0.5, 0.5, 0.25, 0.0, 0.0, 0.0, 0.0, 0.0],
                              [0.0, 0.0, 0.15, 0.5, 0.0, 0.25, 0.5, 0.25, 0.25, 0.5, 0.5, 0.05, 0.5, 0.25, 0.05, 0.0],
                              [0.0, 0.0, 0.05, 0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.25, 0.95, 0.5, 0.75, 0.95, 1.0]],
                      evidence=[cover, migration],
                      evidence_card=[4, 4])

# Add CPDs to the network
net.add_cpds(cpd_cover, cpd_migration, cpd_fish)

# Print the network structure and CPDs
print(net.nodes())
print(net.edges())
for cpd in net.get_cpds():
    print(cpd)

for node in net.nodes():
    cpd = net.get_cpds(node)
    if cpd is not None:
        states = cpd.cardinality[0]
        print(f"Node: {node}, States: {states}")
    else:
        print(f"Node: {node}, CPD not defined")


import networkx as nx
import pylab as plt
graph = nx.DiGraph(net.edges())

# Set node positions for better visualization
pos = nx.spring_layout(graph)

# Draw nodes, edges, and labels
nx.draw(graph, pos, with_labels=True, arrows=True)

# Show the plot
plt.show()


print("================================")

cpd_fish = net.get_cpds('fish')
cpd_cover = net.get_cpds('cover')

probabilities = {}

# Probability of fish migration
prob_no_barriers = cpd_fish.values[0, 0, 0]
prob_low_barriers = cpd_fish.values[0, 1, 0]
prob_medium_barriers = cpd_fish.values[0, 2, 0]
prob_high_barriers = cpd_fish.values[0, 3, 0]
probabilities['Fish Migration'] = {
    'No Barriers': prob_no_barriers,
    'Low Barriers': prob_low_barriers,
    'Medium Barriers': prob_medium_barriers,
    'High Barriers': prob_high_barriers
}

# Probability of fish being covered
prob_cover_discharge_zero = cpd_cover.values[0, 0]
prob_cover_discharge_low = cpd_cover.values[1, 0]
prob_cover_discharge_medium = cpd_cover.values[2, 0]
prob_cover_discharge_high = cpd_cover.values[3, 0]
probabilities['Fish Being Covered'] = {
    'Discharge Zero': prob_cover_discharge_zero,
    'Discharge Low': prob_cover_discharge_low,
    'Discharge Medium': prob_cover_discharge_medium,
    'Discharge High': prob_cover_discharge_high
}

# Probability of fish wellbeing
prob_wellbeing_discharge_zero = cpd_fish.values[0, 0, :]
prob_wellbeing_discharge_low = cpd_fish.values[0, 1, :]
prob_wellbeing_discharge_medium = cpd_fish.values[0, 2, :]
prob_wellbeing_discharge_high = cpd_fish.values[0, 3, :]
probabilities['Fish Wellbeing'] = {
    'Discharge Zero': prob_wellbeing_discharge_zero,
    'Discharge Low': prob_wellbeing_discharge_low,
    'Discharge Medium': prob_wellbeing_discharge_medium,
    'Discharge High': prob_wellbeing_discharge_high
}

# Print all probabilities
for category, values in probabilities.items():
    print(category)
    for scenario, probability in values.items():
        print(f"{scenario}: {probability}")
    print()
