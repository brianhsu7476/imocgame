score, weight=[0]*6, [1000, 800, 700, 600, 500, 300]
for i in range(7):
    s, w=input(), weight.copy()
    k=-1
    for j in range(5):
        if s[j*2+1]=='=':
            w[j+1]+=w[j]
        else:
            for l in range(k+1, j+1):
                w[l]=w[j]/(j-k)
            k=j
    for l in range(k+1, 6):
        w[l]=w[5]/(5-k)
    for j in range(6):
        score[int(s[j*2])-1]+=w[j]
    print(w)
print(score)

