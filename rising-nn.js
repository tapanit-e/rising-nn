var Point = function(vector, max, min) {

	this.vector = vector,
	this.x = (Math.random() * (max - min) + min);
	this.z = (Math.random() * (max - min) + min);
	this.y = 0;

};

var RisingNN = function(dataset, iterations = 50, alpha = 0.1, variance = 0.5, percentage = 2, interestringAttributes = {}) {

	this.dataset = dataset,
	this.points = [],
	this.iterations = iterations,
	this.alpha = alpha;
	this.variance = variance,
	this.percentage = percentage,
	this.interestingAttributes = interestringAttributes;
	
	this.initPoints();
	
	this.getFeatureVectors();
	
	this.getMaxValues();
	
	this.getMaxSimilarity();
	
	this.getMaxGaussianValue();
	
};

RisingNN.prototype.getFeatureVectors = function() {

	var updatedDataset = [];
	
	var length = Object.keys(this.interestingAttributes).length

	for (var i = 0; i < this.dataset.length; i++) {
	
		var feature = [];
	
		for (var j = 0; j < this.dataset[i].length; j++) {
		
			if (i in this.interestingAttributes || length === 0)
				feature.push(this.dataset[i][j]);
		
		}
		
		updatedDataset.push(feature);
	
	}
	
	for (var i = 0; i < updatedDataset.length; i++)
		this.points[i].vector = updatedDataset[i];

};

RisingNN.prototype.addData = function(dataset) {

	this.dataset = [];

	for (var i = 0; i < dataset.length; i++)
		this.dataset.push(dataset[i]);
		
	this.getFeatureVectors();
	
	this.getMaxValues();
	
	this.getMaxSimilarity();
	
	this.getMaxGaussianValue();

};

RisingNN.prototype.getMaxSimilarity = function() {

	this.max = -1;
	
	for (var i = 0; i < this.points.length; i++) {
	
		var sim = this.similarity(this.maxValues, this.points[i].vector);
		
		if (sim > this.max)
			this.max = sim;
	
	}

};

RisingNN.prototype.getMaxValues = function() {

	var maxValues = this.points[0].vector;
	
	for (var i = 0; i < this.points.length; i++) {
	
		for (var j = 0; j < this.points[i].vector.length; j++) {
		
			if (this.points[i].vector[j] > maxValues[j])
				maxValues[j] = this.points[i].vector[j];
		
		}
	
	}
	
	this.maxValues = maxValues;

};

RisingNN.prototype.getMaxGaussianValue = function() {

	this.maxGaussian = ((1 / (this.variance * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(0 / this.variance, 2))) / this.percentage;

};

RisingNN.prototype.initPoints = function() {

	for (var i = 0; i < this.dataset.length; i++)
		this.points.push(new Point(this.dataset[i], 100, 0));

};

RisingNN.prototype.similarity = function(feature, comparison) {
	
	var sum = 0
  
  	for (var i = 0; i < feature.length; i++) {
    
    	sum += Math.pow(feature[i] - comparison[i], 2);
  
  	}
  
  	var dist = Math.sqrt(sum);

	return (1 / (1 + dist));

};

RisingNN.prototype.run = function() {

	for (var iter = 0; iter < this.iterations; iter++) {

		for (var i = 0; i < this.points.length; i++) {
	
			var sim = this.similarity(this.maxValues, this.points[i].vector);
		
			this.points[i].x += this.update(0, this.points[i].x, sim);
			this.points[i].z += this.update(0, this.points[i].z, sim);
			this.points[i].y += this.alpha * this.density(sim);
	
		}
	
	}

};

RisingNN.prototype.update = function(feature, comparison, similarity) {

	return (feature - comparison) * this.alpha * this.density(similarity);

};

RisingNN.prototype.density = function(similarity) {
	
	return (1 / (this.variance * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((similarity - this.max) / this.variance, 2)) - this.maxGaussian;

};