#!/bin/bash
kubectl apply -f helm/jenkins/templates/jenkins-pvc.yaml
kubectl apply -f helm/jenkins/templates/jenkins-rbac.yaml
kubectl apply -f helm/jenkins/templates/jenkins-rbac-helm.yaml
kubectl apply -f helm/jenkins/templates/jenkins-deployment.yaml
kubectl apply -f helm/jenkins/templates/jenkins-service.yaml