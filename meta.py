# PYTHON 3
# make a network of just the representative images of each cluster and their intra cluster matches

import json

## OBJECTS: input cluster file and adjacency list 
o = open ("meta2.json", "w")
y = open ("results_flickr_10_2017.csv", "r")
x = open ("mcl_flickr_10_2017.txt", "r")
clusters_list = []
adjacency_list = []

## FUNCTIONS: 

# get all node ids that match a single input node
def getmatches(node):
    matches = [] #output a list of the matches, without the weights

    for i in range (0, len(adjacency_list)): #search through the adjacency list for the corresponding row
        parts = adjacency_list[i].split(',')[0]
        seed = parts
        allm = []
        if seed == node:
            allm = adjacency_list[i].split(',')[2:]

        for m in allm:
            match = m.split(' ')[0]
            matches.append(match)

    return matches 

# given an input node, return the cluster that contains it
def getcluster(node):
    idx = 0
    for cluster in clusters_list:
        if node in cluster:
            return idx
        idx = idx + 1
    return -1

# given a node, find all of its matches and the clusters that they belong to
def getmatchescluster (node):

    matchescluster = []

    # get all the node ids that it has matched with
    matches = getmatches(node)

    # for each match, find the cluster it belongs to
    for match in matches:
        matchescluster.append (getcluster(match))

    return matchescluster


## MAIN 

# read in the files into adjacency_list and clusters_list
for line in y:
    adjacency_list.append(line.rstrip())
y.close()

for line in x:
    clusters_list.append(line.rstrip())
x.close()

# for each cluster, print out clusters that contain the nodes that nodes in that cluster match with 
nodes = [] 
links = []
for i in range(0, len(clusters_list)):

    node = {}
    link = {} 

    TARGETS = []


    elements = clusters_list[i].split('\t')
    allmatches = []

    for elem in elements:
        matches = getmatchescluster(elem)
        for match in matches:
            allmatches.append(match)

    for match in allmatches:
        if match != i:
            TARGETS.append(match)

    targets = set(TARGETS)

    if (targets):
        for t in set(targets):
            link["source"] = i
            link["target"] = t
            link["weight"] = TARGETS.count(t) 
            links.append(link.copy())

    node["name"] = i
    node["id"] = i
    node["value"] = len(elements)
    nodes.append(node.copy())


print ("{\"nodes\":", file=o)
print (json.dumps(nodes), file = o)
print (",", file=o)
print ("\"links\":", file=o)
print (json.dumps(links), file = o)
print ("}", file = o)



